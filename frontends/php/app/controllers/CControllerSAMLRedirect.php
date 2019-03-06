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

class CControllerSAMLRedirect extends CController
{
    protected function init() {
        $this->disableSIDValidation();
    }

    /**
     * Check user permissions.
     *
     *
     * @return bool
     */
    protected function checkPermissions()
    {
        return true;
    }

    /**
     * Validate input parameters.
     *
     *
     * @return bool
     */
    protected function checkInput()
    {
        return true;
    }

    /**
     * Execute action and generate response object.
     *
     *
     * @return var
     */
    protected function doAction()
    {
        $config = select_config();
        $container = new CSamlContainer($this);

        SAML2\Compat\ContainerSingleton::setContainer($container);

        // Set up an AuthnRequest
        $request = new SAML2\AuthnRequest();
        $request->setId($container->generateId());
        $request->setIssuer('https://sp.example.edu');
        $request->setDestination('https://idp.example.edu');

        // Send it off using the HTTP-Redirect binding
        $binding = new SAML2\HTTPRedirect();
        $binding->send($request);

    }
}