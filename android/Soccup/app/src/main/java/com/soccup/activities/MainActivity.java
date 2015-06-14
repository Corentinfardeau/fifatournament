package com.soccup.activities;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.soccup.R;


public class MainActivity extends AppCompatActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // COMPONENTS
        Button beginButton = (Button) findViewById(R.id.begin);

        // LAUNCH APPLICATION
        beginButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
            Intent intent = new Intent(MainActivity.this, ConfigurationActivity.class);
            startActivity(intent);
            overridePendingTransition(R.anim.slide_to_left, R.anim.slide_to_right);
            }
        });
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
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
