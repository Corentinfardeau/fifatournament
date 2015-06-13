package com.soccup;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/**
 * Created by Valentin on 11/06/2015.
 */
public class RankFragment extends Fragment {

    private static final String ARG_POSITION = "position";
    private int position;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        position = getArguments().getInt(ARG_POSITION);
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_rank, container, false);
        return view;
    }

    public static Fragment newInstance(int index) {
        RankFragment f = new RankFragment();
        Bundle b = new Bundle();
        b.putInt(ARG_POSITION, index);
        f.setArguments(b);
        return f;
    }

    public void reload() {
        Log.d("RELOAD", "MATRIX RELOADED");
    }
}