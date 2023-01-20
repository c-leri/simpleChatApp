<?php
use Celeri\ChatApp\RatchetServer;

require dirname(__DIR__) . '/vendor/autoload.php';

$server = new RatchetServer();
$server->start(8080);