package com.soccup;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;

import com.squareup.okhttp.Response;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Created by Valentin on 04/06/2015.
 */
public class CreateRandomTeam extends Activity {
    private String idLeague;
    private String tournament;
    private Api api =  new Api();

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.create_random_team);


        Button btnbegin = (Button) findViewById(R.id.btnBegin);
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
                                createPlayers(options);
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

    private void createPlayers(Map<String, Object> options) {
        api.createPlayers(options, new Api.ApiCallback() {
            public void onFailure(String error) {
                Log.d("Create Players", error);
            }

            public void onSuccess(Response response) throws IOException, JSONException {
                startNextActivity();
            }
        });
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
