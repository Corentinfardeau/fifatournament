package com.soccup;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

public class TabsFragmentPagerAdapter extends FragmentPagerAdapter {

    private final String[] TITLES = { "EN COURS", "TOUS", "CLASSEMENT" };

    public TabsFragmentPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public CharSequence getPageTitle(int position) {

        return TITLES[position];
    }

    @Override
    public int getCount() {
        return TITLES.length;
    }

    public Fragment getItem(int index) {
        switch (index) {
            case 0:
                return CurrentMatchFragment.newInstance(index);

            case 1:
                return MatchsFragment.newInstance(index);

            case 2:
                return RankFragment.newInstance(index);

            default:
                return null;
        }
    }

}