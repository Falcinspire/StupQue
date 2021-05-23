import React, { useState } from "react";
import { Typography } from "@material-ui/core";

function NewIndicator() {
  return (
    <Typography variant='body2' style={{ fontWeight: 'bold', color: 'green', textTransform: 'uppercase', marginRight: '8px' }}>
      New
    </Typography>
  );
}

export default NewIndicator;
