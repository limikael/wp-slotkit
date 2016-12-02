<div class="wrap">
    <h2>Slotkit</h2>

    <p>
        Select which user account that will serve as the house account.
    </p>
    <form method="post" action="options.php">
        <?php settings_fields( 'slotkit' ); ?>
        <?php do_settings_sections( 'slotkit' ); ?>

        <table class="form-table">
            <tr valign="top">
                <th scope="row">Default Play Money</th>
                <td>
                    <input type="text" class="regular-text" 
                        name="slotkit_default_play_money"
                        value="<?php echo get_option("slotkit_default_play_money"); ?>"/>
                    <p class="description">
                        The default amount of playmoney.
                    </p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row">Collection Schedule</th>
                <td>
                    <select name="slotkit_collect_revenue_schedule">
                        <option value="daily"
                            <?php if ($collectionShedule=="daily") echo "selected"; ?>
                        >Daily</option>
                        <option value="weekly"
                            <?php if ($collectionShedule=="weekly") echo "selected"; ?>
                        >Weekly</option>
                        <option value="monthly"
                            <?php if ($collectionShedule=="monthly") echo "selected"; ?>
                        >Monthly</option>
                    </select>
                    <p class="description">
                        How often shoud funds be moved from the house account to the revenue account?
                    </p>
                </td>
            </tr>
            <?php if ($showBitcoinAccounts) { ?>
                <tr valign="top">
                    <th scope="row">Bitcoin House Account</th>
                    <td>
                        <p>Balance: <?php echo $bitcoinHouseBalance; ?> btc</p>
                        <p class="description">
                            Address: <?php echo $bitcoinHouseAddress; ?>
                        </p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Bitcoin Revenue Account</th>
                    <td>
                        <p>Balance: <?php echo $bitcoinRevenueBalance; ?> btc</p>
                        <p class="description">
                            Address: <?php echo $bitcoinRevenueAddress; ?>
                        </p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">Bitcoin Accumulated NGR</th>
                    <td>
                        <?php echo $bitcoinUncollected; ?> btc</p>
                        <p class="description">
                            Will be moved from the house account to the revenue account in 
                            <?php echo $bitcoinCollectIn; ?>.<br/>
                            <a href="<?php echo $collectUrl; ?>">Collect now</a>
                        </p>
                    </td>
                </tr>
            <?php } ?>
        </table>

        <?php submit_button(); ?>
    </form>
</div>