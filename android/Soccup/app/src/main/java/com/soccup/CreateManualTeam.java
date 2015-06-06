package com.soccup;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateManualTeam extends Activity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_manual_team);

        String data;
        Integer color;
        Bundle extras = getIntent().getExtras();

        Button btnCreateTeam = (Button)findViewById(R.id.btnCreateTeam);
        btnCreateTeam.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                // CREATE PLAYERS
                // CREATE A LEAGUE
                Intent intent = new Intent(CreateManualTeam.this, CurrentTournament.class);
                startActivity(intent);
                overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
            }
        });

        if (extras != null) {
            data = extras.getString("TOURNAMENT");
            try {
                JSONObject json = new JSONObject(data);
                Double nbTeam = Math.ceil(json.getInt("nbPlayers") / json.getInt("nbPlayersByTeam"));

                //List color
                String[] colorList = getApplicationContext().getResources().getStringArray(R.array.color);
                List<Integer> colors = new ArrayList<Integer>();
                for (int i = 0; i < colorList.length; i++) {
                    int newColor = Color.parseColor(colorList[i]);
                    colors.add(newColor);
                }

                // USE THE COLOR API
                // GET THE TEAMS COLOR

                for(int i = 1; i <= nbTeam; i++) {
                    LinearLayout boxTeam = (LinearLayout) getLayoutInflater().inflate(R.layout.add_team_layout, null);
                    LinearLayout boxContentTeam = (LinearLayout) findViewById(R.id.layout_content_team_manual);

                    for (int j = 0; j <= json.getInt("nbPlayersByTeam"); j++) {
                        com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_player_input, null);
                        if(j == 0){
                            com.rengwuxian.materialedittext.MaterialEditText inputTeam = (com.rengwuxian.materialedittext.MaterialEditText) getLayoutInflater().inflate(R.layout.add_team_input, null);
                            inputTeam.setHint("Equipe " + i);
                            inputTeam.setFloatingLabelText("Equipe " + i);

                            //Random color list
                            int rand = new Random().nextInt(colors.size());
                            color = colors.get(rand);
                            colors.remove(rand);

                            inputTeam.setBackgroundColor(color);

                            boxTeam.addView(inputTeam);
                        }else{
                            input.setHint("Joueur " + j);
                            input.setFloatingLabelText("Joueur " + j);
                            boxTeam.addView(input);
                        }
                    }
                    boxContentTeam.addView(boxTeam);
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
