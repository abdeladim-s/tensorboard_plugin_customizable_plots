# Customizable Plots - Tensorboard Plugin

## Overview
This plugin is a Tensorboard dashboard to visualize, customize 
and export ready-to-use scalar plots.

_Based on [plotly.js](https://github.com/plotly/plotly.js/),
[react](https://github.com/facebook/react) and [material-ui](https://github.com/mui/material-ui)._

![](demo.gif)
## Installation
```bash
pip install tensorboard-plugin-customizable-plots
```
After running Tensorboard, a new tab labeled `CUSTMOZIABLE PLOTS` will be added to your dashboard.

## Features
The plugin has almost the same features as the `TIME SERIES` or the `CUSTOM SCALARS` dashboards, 
plus [plotly.js](https://github.com/plotly/plotly.js/) features:

* The ability to customize the plot title and the axis labels.
* The ability to customize the colors. 
* Legends are attached with each plot.
* X-axis and Y-axis both support `log` scale.
* The customized plots can be exported to many image formats including `svg` and `png`.

_Check [plotly.js documentation](https://plotly.com/javascript/reference/) 
for the full list of features and options._

## Limitations
The plugin has some limitations though:
* Not as good and stylish as the `TIME SERIES` plugin. 
* Somehow slow  :(
* The settings with a text field are not applied until `Enter` is pressed (I tried to implement `onChange` but it makes the plugin very luggy and slower)

## license
The plugin is licensed under the Apache License, Version 2.0. See `LICENSE` for the full license text.