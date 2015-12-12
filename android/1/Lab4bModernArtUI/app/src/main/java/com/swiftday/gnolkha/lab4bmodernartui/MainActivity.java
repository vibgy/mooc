package com.swiftday.gnolkha.lab4bmodernartui;

import android.app.Activity;
import android.app.DialogFragment;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.SeekBar;
import android.widget.TextView;

import org.w3c.dom.Text;

import java.util.HashMap;


public class MainActivity extends Activity {

    private DialogFragment mFragment;
    private SeekBar mSeekBar;
    private TextView mBoxes[];
    private HashMap<TextView, Integer> originalColorMap;
    private int savedWhiteIndex = 0;

    static String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initUI();
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
            showDialogBox();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void showDialogBox() {
        mFragment = AlertDialogFragment.newInstance();
        mFragment.show(getFragmentManager(), "Alert");
    }

    private void initUI() {

        mBoxes = new TextView[5];
        mBoxes[0] = (TextView) findViewById(R.id.t00);
        mBoxes[1] = (TextView) findViewById(R.id.t10);
        mBoxes[2] = (TextView) findViewById(R.id.t01);
        mBoxes[3] = (TextView) findViewById(R.id.t11);
        mBoxes[4] = (TextView) findViewById(R.id.t21);
/*
        originalColorMap = new HashMap<TextView, Integer>();
        for (int i=0; i < 5; i++) {
            originalColorMap[mBoxes[i]] = (Drawable)(mBoxes[i].getBackground());
        }
*/
        final int colorCodes[] = new int[]{R.color.blue, R.color.red, R.color.green, R.color.orange, R.color.purple};

        for (int i = 0; i < 5; i++) {
            mBoxes[i].setBackgroundColor(getResources().getColor(colorCodes[i]));
        }

        // by default 0 is white
        mBoxes[0].setBackgroundColor(getResources().getColor(R.color.white));

        mSeekBar = (SeekBar) findViewById(R.id.seekBar);
        mSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
                Log.w(TAG, "position " + i);
                int whiteIdx = savedWhiteIndex;
                mBoxes[i].setBackgroundColor(getResources().getColor(R.color.white));
                mBoxes[whiteIdx].setBackgroundColor(getResources().getColor(colorCodes[whiteIdx]));
                savedWhiteIndex = i;
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });
    }
}
