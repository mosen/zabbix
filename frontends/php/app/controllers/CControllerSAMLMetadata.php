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

class CControllerSAMLMetadata extends CController
{
    protected function init() {
        $this->disableSIDValidation();
    }

    /**
     * Only super admins should be able to download SAML SP Metadata
     *
     * @return bool
     */
    protected function checkPermissions() {
        return $this->getUserType() == USER_TYPE_SUPER_ADMIN;
    }

    /**
     * Validate input parameters.
     */
    protected function checkInput()
    {
        return true;
    }

    /**
     * Execute action and generate response object.
     *
     */
    protected function doAction()
    {
        $config = select_config();
        $md = new CSamlMetadata($config);

        $data = [
            'main_block' => $md->toXMLString(),
        ];

        $response = new CControllerResponseData($data);
        $response->setFileName('zabbix_saml_sp_metadata.xml');
        $response->disableView();
        $this->setResponse($response);
    }
}