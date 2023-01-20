<?php
namespace Celeri\ChatApp;

use Ratchet\Http\HttpServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class RatchetServer implements MessageComponentInterface
{
    private \SplObjectStorage $clients;
    private array $users;

    public function start($port)
    {
        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    $this
                )
            ),
            $port
        );
        $server->run();
    }

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->users = array();
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
        $this->users[$conn->resourceId] = new User('user_'.$conn->resourceId);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $message = json_decode($msg);
        $message->name = $this->users[$from->resourceId]->getName();

        foreach ($this->clients as $client) {
            if ($client === $from) {
                $message->sender = true;
            } else {
                $message->sender = false;
            }
            $client->send(json_encode($message));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
        unset($this->users[$conn->resourceId]);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occured: {e->getMessage()}\n";
        unset($this->users[$conn->resourceId]);
        $conn->close();
    }
}