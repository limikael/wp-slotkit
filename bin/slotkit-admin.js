jQuery(function($) {

	function getEnabledTweaks() {
		var enabled=[];

		$("input[name='tweaks[]']").each(function() {
			if ($(this).attr("checked"))
				enabled.push($(this).val());
		});

		return enabled;
	}

	function updateTweakParameters() {
		var allTweakParameters=[];
		for (var tweakName in SLOTKIT_TWEAK_PARAMETERS) {
			var tweakParameterNames=SLOTKIT_TWEAK_PARAMETERS[tweakName];

			for (var i=0; i<tweakParameterNames.length; i++)
				allTweakParameters.push(tweakParameterNames[i]);
		}

		var enabledTweakParameters=[];
		var enabledTweaks=getEnabledTweaks();
		for (var i in enabledTweaks) {
			var tweakName=enabledTweaks[i];
			var tweakParameterNames=SLOTKIT_TWEAK_PARAMETERS[tweakName];

			for (var i=0; i<tweakParameterNames.length; i++)
				enabledTweakParameters.push(tweakParameterNames[i]);
		}

		for (var i=0; i<allTweakParameters.length; i++) {
			var parameterName=allTweakParameters[i];

			if (enabledTweakParameters.indexOf(parameterName)>=0) {
				$("#"+parameterName).closest(".rwmb-field").show();
				$("[data-field_id='"+parameterName+"'").closest(".rwmb-field").show();
				$("[name='"+parameterName+"[]']").closest(".rwmb-field").show();
			}

			else {
				$("#"+parameterName).closest(".rwmb-field").hide();
				$("[data-field_id='"+parameterName+"'").closest(".rwmb-field").hide();
				$("[name='"+parameterName+"[]']").closest(".rwmb-field").hide();
			}
		}
	}

	$(document).ready(function() {
		if (typeof SLOTKIT_TWEAK_PARAMETERS==="undefined")
			return;

		updateTweakParameters();
		$("input[name='tweaks[]']").change(updateTweakParameters);
	});
});