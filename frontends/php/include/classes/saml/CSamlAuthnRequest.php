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


class CSamlAuthnRequest
{
    private $doc;

    public function __construct($config)
    {
        $this->doc = new DOMDocument('1.0', 'utf-8');
        $this->doc->formatOutput = true;

        $this->appendAuthnRequest($this->doc, $config);
    }

    /**
     * Render the XML Metadata Document as a string.
     *
     * @return string
     */
    public function toXMLString() {
        return $this->doc->saveXML();
    }

    protected function appendAuthnRequest(\DOMDocument &$document, $config) {
        $root = $document->createElementNS('urn:oasis:names:tc:SAML:2.0:protocol', 'samlp:AuthnRequest');
        $root->setAttributeNS(
            'http://www.w3.org/2000/xmlns/',
            'xmlns:samlp', 'urn:oasis:names:tc:SAML:2.0:protocol');
        $root->setAttributeNS(
            'http://www.w3.org/2000/xmlns/',
            'xmlns:saml', 'urn:oasis:names:tc:SAML:2.0:assertion');

        $root->setAttribute('Version', '2.0');
        $root->setAttribute('ID', 'id1234');
        $root->setAttribute('ProviderName', 'Zabbix');
        $root->setAttribute('Destination', 'https://login.microsoftonline.com/14043460-e78d-48d4-97ce-af3dc0335e11/saml2');
        $root->setAttribute('ProtocolBinding', 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST');
        $root->setAttribute('AssertionConsumerServiceURL', 'https://zabbix.test:8443/zabbix.php?action=saml.sso');
        $root->setAttribute('IssueInstant', date(DateTime::ISO8601));
        // post binding https://login.microsoftonline.com/14043460-e78d-48d4-97ce-af3dc0335e11/saml2

        $this->appendIssuer($root, $config);
        $this->appendNameIdPolicy($root, $config);
        $this->appendRequestedAuthnContext($root, $config);

        $document->appendChild($root);
    }

    protected function appendIssuer(\DOMElement &$parentElement, $config) {
        $issuer = $this->doc->createElementNS('urn:oasis:names:tc:SAML:2.0:assertion',
            'saml:Issuer', 'https://zabbix.test:8443/');
        $parentElement->appendChild($issuer);
    }

    protected function appendNameIdPolicy(\DOMElement &$parentElement, $config) {
        $nameIdPolicy = $this->doc->createElementNS('urn:oasis:names:tc:SAML:2.0:protocol',
            'samlp:NameIDPolicy');
        $nameIdPolicy->setAttribute('Format', ZBX_SAML_NAMEID_EMAILADDRESS);
        $nameIdPolicy->setAttribute('AllowCreate', 'true');

        $parentElement->appendChild($nameIdPolicy);
    }

    protected function appendRequestedAuthnContext(\DOMElement &$parentElement, $config) {

    }
}