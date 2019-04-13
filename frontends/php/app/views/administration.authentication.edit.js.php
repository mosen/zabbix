<script type="text/javascript">
	jQuery(function ($) {
		var form = $('[name=form_auth]'),
			warn = true;

		form.submit(function () {
			var proceed = !warn
				|| $('[name=authentication_type]:checked').val() == $('[name=db_authentication_type]').val()
				|| confirm(<?= CJs::encodeJson(
					_('Switching authentication method will reset all except this session! Continue?')
				) ?>);
			warn = true;

			return proceed;
		});

		form.find('#http_auth_enabled,#ldap_configured,#saml_configured').change(function () {
			var fields;

			if ($(this).is('#http_auth_enabled')) {
			  fields = form.find('[name^=http_]');
      } else if ($(this).is('#ldap_configured')) {
			  fields = form.find('[name^=ldap_],button[name=change_bind_password]');
      } else if ($(this).is('#saml_configured')) {
			  fields = form.find('[name^=saml_]');
      }

			fields
				.not('[name=http_auth_enabled],[name=ldap_configured]')
				.prop('disabled', !this.checked);
		});

		form.find('button#change_bind_password').click(function () {
			form.find('[name=action]')
				.val(form.find('[name=action_passw_change]').val());

			submitFormWithParam('form_auth', 'change_bind_password', '1');
		});

		form.find('[name=ldap_test]').click(function () {
			warn = false;
		});
	});
</script>
