package com.swiftday.gnolkha.lab4bmodernartui;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link AlertDialogFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link AlertDialogFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AlertDialogFragment extends DialogFragment {

    public static AlertDialogFragment newInstance() {
        AlertDialogFragment fragment = new AlertDialogFragment();
        return fragment;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        return new AlertDialog.Builder(getActivity())
                .setMessage(R.string.question)
                .setCancelable(true)
                .setPositiveButton(R.string.visit_moma, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        // show them the webpage
                        Intent show = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.moma.org"));
                        startActivity(show);
                    }
                })
                .setNegativeButton(R.string.not_now, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //dismiss the dialog
                        dismiss();
                    }
                })
                .create();

    }
}
