jQuery(function($) {

	function getEnabledTweaks() {
		var enabled=[];

		$("[id^=tweaks]").find(":selected").each(function() {
			var v=$(this).val();
			if (v)
				enabled.push(v);
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

			if (enabledTweakParameters.indexOf(parameterName)>=0)
				$("#"+parameterName).closest(".rwmb-field").show();

			else
				$("#"+parameterName).closest(".rwmb-field").hide();
		}
	}

	function updateTweakParametersDelayed() {
		setTimeout(updateTweakParameters,0);
	}

	$(document).ready(function() {
		updateTweakParameters();

		$("#tweaks").change(updateTweakParameters);
		$(".add-clone").click(updateTweakParametersDelayed);
		$(document).on("click",".remove-clone",updateTweakParametersDelayed);
	});
});