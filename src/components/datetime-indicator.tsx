import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import { DateTime } from "luxon";

import firebase from 'firebase/app';
import 'firebase/firestore';

/**
 * Displays a firestore timestamp as a formatted text
 * 
 * @param props.datetime The datatime to display
 */
function DateTimeIndicator(props: { datetime: firebase.firestore.Timestamp }) {
  const { datetime } = props;
  return (
    <Typography variant='body2' style={{ margin: 0 }}>
      {DateTime.fromJSDate(datetime.toDate()).toLocaleString(DateTime.DATETIME_MED)}
    </Typography> 
  );
}

export default DateTimeIndicator;
