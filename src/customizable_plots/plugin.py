#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
A plugin for TensorBoard to customize and export Scalar plots.
Based on Plotly.js

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""

__author__ = "Abdeladim S."
__copyright__ = "Copyright 2022, "
__deprecated__ = False
__license__ = "Apache License 2.0"
__maintainer__ = __author__
__version__ = "1.0.1"

import mimetypes
import os
from collections import defaultdict
from werkzeug import wrappers
from tensorboard import plugin_util
from tensorboard.backend import http_util
from tensorboard.data import provider
from tensorboard.plugins import base_plugin
from tensorboard.plugins.scalar import metadata
import time

NAME = 'tensorboard_plugin_customizable_plots'

_PLUGIN_DIRECTORY_PATH_PART = f"/data/plugin/{NAME}/"



class CustomizablePlots(base_plugin.TBPlugin):
    """A plugin for TensorBoard to customize and export Scalar plots."""

    plugin_name = NAME

    def __init__(self, context):
        self._data_provider = context.data_provider
        self.tab_name = "CUSTOMIZABLE PLOTS"

    def get_plugin_apps(self):
        return {
            "/tags": self._serve_tags_list,
            "/runs": self._serve_runs,
            "/data": self._serve_data,
            "/static/*": self._serve_static_file,
        }

    @wrappers.Request.application
    def _serve_static_file(self, request):
        """Returns a resource file from the static asset directory.

        Checks the normpath to guard against path traversal attacks.
        """
        static_path_part = request.path[len(_PLUGIN_DIRECTORY_PATH_PART):]
        resource_name = os.path.normpath(
            os.path.join(*static_path_part.split("/"))
        )
        if not resource_name.startswith("static" + os.path.sep):
            return http_util.Respond(
                request, "Not found", "text/plain", code=404
            )

        resource_path = os.path.join(os.path.dirname(__file__), resource_name)
        with open(resource_path, "rb") as read_file:
            mimetype = mimetypes.guess_type(resource_path)[0]
            return http_util.Respond(
                request, read_file.read(), content_type=mimetype
            )

    def is_active(self):
        """Returns whether there is relevant data for the plugin to process.

        When there are no runs with scalar data, TensorBoard will hide the plugin
        from the main navigation bar.
        """
        return True

    def frontend_metadata(self):
        return base_plugin.FrontendMetadata(es_module_path="/static/index.js", tab_name=self.tab_name)

    @wrappers.Request.application
    def _serve_data(self, request):
        """Given a tag and single run, return array of ScalarEvents."""
        HAChoices = ['Step', 'Time']
        ha = request.args.get('ha')
        if ha not in HAChoices:
            ha = HAChoices[0]

        ctx = plugin_util.context(request.environ)
        experiment = plugin_util.experiment_id(request.environ)
        run_tag_mapping = self._data_provider.list_scalars(
            ctx,
            experiment_id=experiment,
            plugin_name=metadata.PLUGIN_NAME,
        )

        data = defaultdict(dict)

        for i, (run, tags) in enumerate(run_tag_mapping.items()):
            for tag in tags:
                all_scalars = self._data_provider.read_scalars(
                    ctx,
                    experiment_id=experiment,
                    plugin_name=metadata.PLUGIN_NAME,
                    downsample=5000,
                    run_tag_filter=provider.RunTagFilter(runs=[run], tags=[tag]),
                )
                scalars = all_scalars.get(run, {}).get(tag, None)
                x = []
                y = []
                for scalar in scalars:
                    y.append(scalar.value)
                    if ha == HAChoices[0]:
                        x.append(scalar.step)
                    elif ha == HAChoices[1]:
                        v = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(scalar.wall_time))
                        x.append(v)
                trace = {'name': str(run),
                         'x': x,
                         'y': y,
                         }
                data[tag][run] = trace
        return http_util.Respond(request, data, "application/json")

    @wrappers.Request.application
    def _serve_runs(self, request):
        """
        Serves runs.
        """
        ctx = plugin_util.context(request.environ)
        experiment = plugin_util.experiment_id(request.environ)
        runs = self._data_provider.list_runs(
            ctx,
            experiment_id=experiment,
        )
        runs = [run.run_name for run in runs]
        return http_util.Respond(request, runs, "application/json")

    @wrappers.Request.application
    def _serve_tags_list(self, request):
        """
        Serves Tags list
        """
        ctx = plugin_util.context(request.environ)
        experiment = plugin_util.experiment_id(request.environ)
        run_tag_mapping = self._data_provider.list_scalars(
            ctx,
            experiment_id=experiment,
            plugin_name=metadata.PLUGIN_NAME,
        )
        tags_list = set()
        for run in run_tag_mapping.keys():
            for tags in run_tag_mapping[run].keys():
                tags_list.add(tags)

        return http_util.Respond(request, list(tags_list), "application/json")
