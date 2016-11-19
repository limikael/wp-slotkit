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
                <th scope="row">House User</th>
                <td>
                    <select name="slotkit_house_user_id"
                            id="slotkit_house_user_id">
                        <option value="">(Please select)</option>
                        <?php foreach ($users as $user) { ?>
                            <option 
                                value="<?php echo $user->ID; ?>"
                                <?php if (get_option("slotkit_house_user_id")==$user->ID) { ?>
                                    selected
                                <?php } ?>
                            >
                                <?php echo $user->user_login; ?>
                                (<?php echo $user->user_email; ?>)
                            </option>
                        <?php } ?>
                    </select>
                    <p class="description">
                        Select house user.
                    </p>
                </td>
            </tr>
        </table>

        <?php submit_button(); ?>
    </form>
</div>