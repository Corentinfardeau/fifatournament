package com.soccup.activities;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.soccup.R;
import com.soccup.models.Tournament;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateRandomTeam extends AppCompatActivity {
    private Toolbar mToolbar;
    private String idLeague;
    private String tournament;

    // MODELS
    private Tournament objectTournament = new Tournament();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_random_team);

        // TOOLBAR
        mToolbar = (Toolbar) findViewById(R.id.tool_bar);
        setSupportActionBar(mToolbar);
        mToolbar.setNavigationIcon(R.drawable.arrow_back);

        // COMPONENTS
        Button btnbegin = (Button) findViewById(R.id.btnBegin);

        // EXTRAS
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            tournament = extras.getString("TOURNAMENT");
            idLeague = extras.getString("LEAGUE");

            try {
                final JSONObject json = new JSONObject(tournament);

                for(int i = 1; i <= json.getInt("nbPlayers"); i++){
                    com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText)getLayoutInflater().inflate(R.layout.add_player_input, null);
                        input.setHint("Joueur "+ i);
                        input.setFloatingLabelText("Joueur " + i);
                        input.setId(i);

                    LinearLayout box = (LinearLayout) findViewById(R.id.linearPlayer);
                    box.addView(input);
                }

                // BUTTON BEGIN EVENT
                btnbegin.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        try {
                            Boolean empty = false;

                            // VERIFY IF INPUTS ARE EMPTY
                            for(int i = 1; i <= json.getInt("nbPlayers"); i++){
                                com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(i);
                                if(input.getText().toString().isEmpty()){
                                    empty = true;
                                }
                            }

                            // CASE OF ONE INPUT OR MORE EMPTY
                            if(empty == true){
                                AlertDialog.Builder builder = new AlertDialog.Builder(CreateRandomTeam.this)
                                    .setTitle("Erreur")
                                    .setMessage("Vous devez remplir tous les champs")
                                    .setPositiveButton("Ok", null);
                                AlertDialog dialog = builder.create();
                                dialog.show();
                            }

                            // NO INPUT EMPTY
                            else{
                                ArrayList<String> players = new ArrayList<String>();
                                for(int i = 1; i <= json.getInt("nbPlayers"); i++){
                                    com.rengwuxian.materialedittext.MaterialEditText input = (com.rengwuxian.materialedittext.MaterialEditText) findViewById(i);
                                    players.add("\""+ input.getText().toString() + "\"");
                                }

                                // SHUFFLE ARRAY PLAYER
                                long seed = System.nanoTime();
                                Collections.shuffle(players, new Random(seed));

                                // BUILD OPTIONS
                                Map<String, Object> options = new HashMap<String, Object>();
                                    options.put("idTournament", json.getString("_id"));
                                    options.put("players", players);

                                // CREATE PLAYERS
                                objectTournament.createPlayers(options, new Tournament.Callback() {
                                    public void onSuccess(Map<String, Object> options) throws JSONException {
                                        startNextActivity();
                                    }
                                });
                            }

                        }  catch (JSONException e) { e.printStackTrace();  }
                    }
                });

            } catch (JSONException e) { e.printStackTrace(); }
        }
    }

    private void startNextActivity() {
        Intent intent;
        intent = new Intent(CreateRandomTeam.this, RenderRandomTeam.class);

        // SET THE TOURNAMENT VALUES TO NEXT ACTIVITY
        intent.putExtra("TOURNAMENT", tournament);
        intent.putExtra("LEAGUE", idLeague);

        // START
        startActivity(intent);
        CreateRandomTeam.this.overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
    }


    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
