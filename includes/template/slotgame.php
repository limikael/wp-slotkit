Currency:
<select>
	<?php foreach ($currencies as $currency) { ?>
		<option value='<?php echo $currency; ?>'><?php echo $currency; ?></option>
	<?php } ?>

</select>
<div id='slotgame' style='width:100%; height:1px; position:relative'></div>
<script>
	SLOTKIT_BASEURL='<?php echo plugins_url()."/wp-slotkit/" ?>';
	SLOTKIT_INITURL='<?php echo $initUrl; ?>';
</script>
