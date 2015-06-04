package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Button;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateRandomTeam extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_random_team);

        String data;
        Button btnbegin = (Button) findViewById(R.id.btnBegin);
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            data = extras.getString("TOURNAMENT");
            try {
                final JSONObject json = new JSONObject(data);
                for(int i = 1; i <= json.getInt("nbPlayers"); i++){
                    com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText)getLayoutInflater().inflate(R.layout.add_player_input, null);
                    input.setHint("Joueur "+ i);
                    input.setFloatingLabelText("Joueur "+ i);
                    input.setId(i);

                    LinearLayout box = (LinearLayout) findViewById(R.id.linearPlayer);
                    box.addView(input);
                }

                // BUTTON BEGIN EVENT
                btnbegin.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        try {
                            for(int i = 1; i <= json.getInt("nbPlayers"); i++){
                                com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(i);
                            }
                        }
                        catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
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
