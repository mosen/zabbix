# Zabbix Frontend : Enhanced #

## Overview ##

> With apologies to Zabbix

During my (very short) usage of Zabbix, I noticed a few inconsistencies in the UI.
I wanted to make my life easier by contributing, but Zabbix makes contribution quite difficult (they are just moving 
to git, they only accepted patches as diffs, they dont generally accept 3rd party libraries).

This fork represents zabbix/zabbix:trunk with one feature branch merged in for every additional feature on top of the
upstream repo.

This will be periodically rebased on top of `trunk`, but no guarantees about how far it will lag behind. You might find
that my frontend is several minor versions behind upstream.

## Additional Features ##

### SAML Authentication ###

This feature adds the option of providing SAML Authentication for the frontend.

You need a basic understanding of SAML to configure this feature.

When this feature is enabled, you will see an additional link on the login page named **Sign in with SAML SSO**. In
future releases the decision to use SAML SSO should be somewhat automatic or based on username/email logins.

#### Implementation ####

Three additional mvc "actions" are provided:

- `saml.redirect`: This initiates the SAML login process by redirecting to the configured IdP (aka HTTP-Redirect binding).
- `saml.assertion`: This is the acs (Assertion Consumer Service) which receives a (HTTP-POST binding) request from the IdP.
- `saml.spmetadata`: You can use this action to generate SP Metadata about your Zabbix installation which is then uploaded
	to the IdP to provide easy configuration. The layout, `layout.xml`, was created to facilitate XML responses like 
	these.

### (TODO) Trigger Function Editor / Enhanced Editors ###

One of the difficulties i found with creating triggers was remembering which keys were valid or which functions were
valid.

This feature should:

- Parse trigger expressions and warn if they are unparseable.
- Highlight syntactical elements of trigger expressions.
- Provide autocompletion of trigger functions.

In addition, most editors should:

- Provide autocompletion of macros, user macros and global regexes.

If we really want to be fancy:

- Provide warnings of insufficient data if you use an aggregate expression on a data set with not enough data.

#### Implementation ####

I provided a PegJS grammar file for generating a parser based on the trigger language which successfully parses any
expression into a tree.

### (TODO) The child item Add button problem ###

In some dialogs, it is necessary to click an Add button when adding child objects to the parent object, before clicking
the "Save" or "Add" button on the parent object.

This basically catches everyone, even seasoned users of Zabbix. I would call this out as an obvious UX flaw.

### (TODO) People often use multiple browser tabs to keep their place ###

This behaviour is indicative of not being able to refer to critical information from one dialog to another, maybe coupled
with the inability to navigate between sections easily (especially in the case of an item nested within eg. triggers
and discovery).

## Structural Changes ##

- `include/classes/core/ZBase.php`: Introduced composer autoloader going forward to replace the **CAutoLoader** class.
	This is definitely something Zabbix would reject as they do not commonly want 3rd party libraries to bloat the code
	base.

## License ##

Zabbix is free software, released under the GNU General Public License
(GPL) version 2.

You can redistribute it and/or modify it under the terms of the GNU GPL
as published by the Free Software Foundation; either version 2 of the
License, or (at your option) any later version.

The formal terms of the GPL can be found at
http://www.fsf.org/licenses/ .

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

Exception for linking with OpenSSL

In addition, as a special exception, we give permission to link the code
of Zabbix with the OpenSSL project OpenSSL library (or with modified
versions of it that use the same license as the OpenSSL library), and
distribute the linked executables.

Please see http://www.zabbix.com/ for detailed information about Zabbix.

On-line Zabbix documentation is available at
http://www.zabbix.com/documentation/4.2/manual/ .

Zabbix installation instructions can be found at
http://www.zabbix.com/documentation/4.2/manual/installation/ .

If you are installing Zabbix from packages the instructions can be found at
http://www.zabbix.com/documentation/4.2/manual/installation/install_from_packages .
