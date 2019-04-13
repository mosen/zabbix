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
        $authn = new CSamlAuthnRequest($config);

        $authnXml = $authn->toXMLString();
//        die($authnXml);
        $msgStr = gzdeflate($authnXml);
        // $msgStr = gzcompress($authnXml);
        $msgStr = base64_encode($msgStr);
        $msgStr = urlencode($msgStr);

        header('Location: https://login.microsoftonline.com/asd/saml2?SAMLRequest=' . $msgStr);

//        $d = urldecode($msgStr);
//        $d = base64_decode($d);
//        $d = gzinflate($d);

        die($d);

        die("" . $msgStr);

        die('did something');
//        $response = new CControllerResponseData([]);
//        $response->setTitle(_('Configuration of proxies'));
//        $this->setResponse($response);
    }
}