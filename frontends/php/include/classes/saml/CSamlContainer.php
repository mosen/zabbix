<?php
/*
** Zabbix
** Copyright (C) 2001-2019 Zabbix SIA
**
** This program is free software; you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation; either version 2 of the License, or
** (at your option) any later version.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program; if not, write to the Free Software
** Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
**/
use SAML2\Compat\AbstractContainer;

/**
 * This class implements the AbstractContainer interface for SimpleSAMLPHP in a Zabbix oriented way.
 */
class CSamlContainer extends AbstractContainer {

    private $controller;

    /**
     * CSamlContainer constructor.
     * @param CController $controller The controller that is using this SAML Container.
     */
    public function __construct($controller) {
        $this->controller = $controller;
    }

    /**
     * Get a PSR-3 compatible logger.
     * @return \Psr\Log\LoggerInterface
     */
    public function getLogger()
    {
        // TODO: Implement getLogger() method.
    }

    /**
     * Generate a random identifier for identifying SAML2 documents.
     * @return string
     */
    public function generateId()
    {
        // TODO: Implement generateId() method.
    }

    /**
     * Log an incoming message to the debug log.
     *
     * Type can be either:
     * - **in** XML received from third party
     * - **out** XML that will be sent to third party
     * - **encrypt** XML that is about to be encrypted
     * - **decrypt** XML that was just decrypted
     *
     * @param string|\DOMNode $message
     * @param string $type
     * @return void
     */
    public function debugMessage($message, $type)
    {
        // TODO: Implement debugMessage() method.
    }

    /**
     * Trigger the user to perform a GET to the given URL with the given data.
     *
     * @param string $url
     * @param array $data
     * @return void
     */
    public function redirect($url, $data = [])
    {
        $response = new CControllerResponseRedirect($url);

        $this->controller->setResponse($response);
    }

    /**
     * Trigger the user to perform a POST to the given URL with the given data.
     *
     * @param string $url
     * @param array $data
     * @return void
     */
    public function postRedirect($url, $data = [])
    {
        $response = new CControllerResponseRedirect($url);
        $response->setFormData($data);

        $this->controller->setResponse($response);
    }
}