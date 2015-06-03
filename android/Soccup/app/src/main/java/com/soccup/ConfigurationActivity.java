package com.soccup;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;


public class ConfigurationActivity extends Activity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_configuration);

        // PICKERS
        Button minusNbPlayers = (Button) findViewById(R.id.minusPlayer);
        Button moreNbPlayers = (Button) findViewById(R.id.morePlayer);
        Button minusNbPlayersByTeam = (Button) findViewById(R.id.minusPlayerByTeam);
        Button moreNbPlayersByTeam = (Button) findViewById(R.id.morePlayerByTeam);
        final TextView nbPlayers = (TextView) findViewById(R.id.nbPlayersNumber);
        final TextView nbPlayersByTeam = (TextView) findViewById(R.id.nbPlayersByTeamNumber);

        minusNbPlayers.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(Integer.parseInt(nbPlayers.getText().toString()) > 2){
                    int newNbPlayers = Integer.parseInt(nbPlayers.getText().toString()) - 1;
                    nbPlayers.setText(Integer.toString(newNbPlayers));
                }
            }
        });

        moreNbPlayers.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                int newNbPlayers = Integer.parseInt(nbPlayers.getText().toString()) + 1;
                nbPlayers.setText(Integer.toString(newNbPlayers));
            }
        });

        minusNbPlayersByTeam.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if(Integer.parseInt(nbPlayersByTeam.getText().toString()) > 2) {
                    int newNbPlayersByTeam = Integer.parseInt(nbPlayersByTeam.getText().toString()) - 1;
                    nbPlayersByTeam.setText(Integer.toString(newNbPlayersByTeam));
                }
            }
        });

        moreNbPlayersByTeam.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                int newNbPlayersByTeam = Integer.parseInt(nbPlayersByTeam.getText().toString()) + 1;
                if(newNbPlayersByTeam < Integer.parseInt(nbPlayers.getText().toString())){
                    nbPlayersByTeam.setText(Integer.toString(newNbPlayersByTeam));
                }
            }
        });

        // BEGIN
        Button createTournament = (Button) findViewById(R.id.btnBegin);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_configuration, menu);
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
