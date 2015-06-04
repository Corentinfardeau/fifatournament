package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.LinearLayout;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateManualTeam extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        String data;
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            data = extras.getString("TOURNAMENT");
            try {
                JSONObject json = new JSONObject(data);
                Double nbTeam = Math.ceil(json.getInt("nbPlayers") / json.getInt("nbPlayersByTeam"));
                for(int i = 1; i <= nbTeam; i++){

                    for (int j = 1; j <= json.getInt("nbPlayersByTeam"); j++) {
                        EditText input = (EditText) getLayoutInflater().inflate(R.layout.add_player_input, null);
                        LinearLayout box = (LinearLayout) findViewById(R.id.linearPlayer);
                        box.addView(input);
                    }
                }
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
