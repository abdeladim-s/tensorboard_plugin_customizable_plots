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
# ==============================================================================


import setuptools

# See https://packaging.python.org/specifications/entry-points/

# read the contents of your README file
from pathlib import Path
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

setuptools.setup(
    name="tensorboard_plugin_customizable_plots",
    version="0.1.8",
    description="A plugin for TensorBoard to customize and export Scalar plots",
    # packages=["tensorboard_plugin_customizable_plots"],
    long_description=long_description,
    long_description_content_type='text/markdown',
    package_data={
        "tensorboard_plugin_customizable_plots": ["static/**"],
    },
    entry_points={
        "tensorboard_plugins": [
            "tensorboard_plugin_customizable_plots = tensorboard_plugin_customizable_plots.plugin"
            ":CustomizablePlots",
        ],
    },
)
