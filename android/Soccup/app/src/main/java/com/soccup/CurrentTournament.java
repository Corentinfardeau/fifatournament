package com.soccup;

import android.app.Activity;
import android.graphics.Point;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;


public class CurrentTournament extends Activity {
    //Origin popup
    Point p;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.current_tournament);

        //change view onglet
/*
        //Button "add but team"
        Button btnAddButHome = (Button)findViewById(R.id.addButTeamHome);
        Button btnAddButAway = (Button)findViewById(R.id.addButTeamAway);

        //Click team Home
        btnAddButHome.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                //Open popup window
                if (p != null)
                    showPopup(CurrentTournament.this, p);
            }
        });

        //Click team away
        btnAddButAway.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                //Open popup window
                if (p != null)
                    showPopup(CurrentTournament.this, p);
            }
        });*/
    }
/*
    //Initialize origin popup
    public void onWindowFocusChanged(boolean hasFocus) {

        int[] location = new int[2];
        LinearLayout box = (LinearLayout) findViewById(R.id.currentMatch);

        // Get the x, y location and store it in the location[] array
        // location[0] = x, location[1] = y.
        box.getLocationOnScreen(location);

        //Initialize the Point with x, and y positions
        p = new Point();
        p.x = location[0];
        p.y = location[1];
    }

    // The method that displays the popup.
    private void showPopup(final Activity context, Point p) {

        // Inflate the popup_layout.xml
        LinearLayout viewGroup = (LinearLayout) context.findViewById(R.id.popupAddScorer);
        LayoutInflater layoutInflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View layout = layoutInflater.inflate(R.layout.add_scorer, viewGroup);

        // Creating the PopupWindow
        final PopupWindow popup = new PopupWindow(context);
        popup.setContentView(layout);
        popup.setWidth(900);
        popup.setHeight(800);
        popup.setFocusable(true);

        // Some offset to align the popup a bit to the right, and a bit down, relative to button's position.
        int OFFSET_X = 20;
        int OFFSET_Y = 20;

        // Displaying the popup at the specified location, + offsets.
        popup.showAtLocation(layout, Gravity.NO_GRAVITY, p.x + OFFSET_X, p.y + OFFSET_Y);

        // Getting a reference to Close button, and close the popup when clicked.
        Button close = (Button) layout.findViewById(R.id.cancel_scorer);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d("test", "test");
                popup.dismiss();
            }
        });
    }*/

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_current_match, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.

        switch (item.getItemId()) {
            case R.id.ongletCurrent:
                // Comportement du bouton "Aide"
                return true;
            case R.id.ongletAll:
                // Comportement du bouton "Rafraichir"
                return true;
            case R.id.ongletClassement:
                // Comportement du bouton "Recherche"
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
