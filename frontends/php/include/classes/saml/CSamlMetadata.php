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


class CSamlMetadata
{
    private $doc;

    private $entityId = 'https://zabbix.server/zabbix/';
    private $nameIdFormat = ZBX_SAML_NAMEID_EMAILADDRESS;
    private $assertionConsumerService;
    private $authnRequestsSigned = 'false';
    private $wantAssertionsSigned = 'true';
    private $protocolSupportEnumeration;
    private $consumerLocation;

    public static $SAML_BINDING_HTTP_POST = 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST';

    /**
     * This class aids in generating SAML 2.0 Service Provider Metadata based on the current Zabbix authentication
     * configuration.
     */
    public function __construct($config) {
        $this->doc = new DOMDocument('1.0', 'utf-8');
        $this->doc->formatOutput = true;

        $this->appendEntityDescriptor($this->doc, $config);
    }

    /**
     * Render the XML Metadata Document as a string.
     *
     * @return string
     */
    public function toXMLString() {
        return $this->doc->saveXML();
    }

    /**
     * Create and append the md:EntityDescriptor element to the given XML Document.
     * This calls each of the child functions in-turn to append their content.
     *
     * @param DOMDocument $document
     * @param array $config Contents of the `config` database table.
     */
    protected function appendEntityDescriptor(\DOMDocument &$document, $config) {
        $root = $document->createElement('EntityDescriptor');
        $root->setAttributeNS(
            'http://www.w3.org/2000/xmlns/',
            'xmlns:md', 'urn:oasis:names:tc:SAML:2.0:metadata');
        $root->setAttribute('entityID', $config['saml_entity_id']);
        $root->setAttribute('ID', $config['saml_entity_id']);

        $this->appendSpSSODescriptor($root, $config);

        $document->appendChild($root);
    }

    /**
     * Append the md:SPSSODescriptor content to the given parent element.
     *
     * @param DOMElement $parentElement
     * @param array $config Contents of the `config` database table.
     *
     */
    protected function appendSpSSODescriptor(\DOMElement &$parentElement, $config) {
        $sso = $this->doc->createElementNS(
            'urn:oasis:names:tc:SAML:2.0:metadata', 'md:SPSSODescriptor');
        $sso->setAttribute('AuthnRequestsSigned', $this->authnRequestsSigned);
        $sso->setAttribute('WantAssertionsSigned', $this->wantAssertionsSigned);
        $sso->setAttribute('protocolSupportEnumeration', 'urn:oasis:names:tc:SAML:2.0:protocol');

        /// Append KeyDescriptors
        /// Append SingleLogout
        $this->appendNameIDFormats($sso, $config);
        $this->appendAssertionConsumerServices($sso, $config);

        $parentElement->appendChild($sso);
    }

    /**
     * Append the md:AssertionConsumerService element to the given parent element.
     *
     * This is the endpoint to which the SAML IDP will POST an assertion.
     *
     * @param DOMElement $parentElement
     * @param $config
     */
    protected function appendAssertionConsumerServices(\DOMElement &$parentElement, $config) {
        $consumer = $this->doc->createElementNS(
            'urn:oasis:names:tc:SAML:2.0:metadata', 'md:AssertionConsumerService');
        $consumer->setAttribute('Binding', static::$SAML_BINDING_HTTP_POST);
        $consumer->setAttribute('Location', $this->consumerLocation);

        $parentElement->appendChild($consumer);
    }

    /**
     * Append the supported NameID format elements to the given parent element.
     *
     * @param DOMElement $parentElement
     * @param $config
     */
    protected function appendNameIDFormats(\DOMElement &$parentElement, $config) {
        $nameIdFormat = $this->doc->createElementNS(
            'urn:oasis:names:tc:SAML:2.0:metadata', 'md:NameIDFormat', $this->nameIdFormat);
        $parentElement->appendChild($nameIdFormat);
    }
}