/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
 'use strict';
/*

# Start in website/ even if run from root directory
cd "$(dirname "$0")"

cd ../../
if [ "$TRAVIS" ]; then
  git clone "https://reactjs-bot@github.com/facebook/react-native.git" react-native-gh-pages
else
  git clone git://github.com/facebook/react-native.git react-native-gh-pages
fi
cd react-native-gh-pages
git checkout origin/gh-pages
git checkout -b gh-pages
git branch --set-upstream-to=origin/gh-pages
cd ../react-native/website

    DOCS_VERSION=${TRAVIS_BRANCH%-stable}
    cd website
    $(which npm) install
    ./setup.sh
    if [ "$TRAVIS_PULL_REQUEST" = false ]
    then
      if [ "$TRAVIS_BRANCH" = master ]
      then
        # Automatically publish the website to /next path
        echo "machine github.com login reactjs-bot password $GITHUB_TOKEN" >~/.netrc
        ./publish-gh-pages.sh next
      elif [[ "$TRAVIS_BRANCH" = *-stable ]]
      then
        # Automatically publish the website to /version path
        echo "machine github.com login reactjs-bot password $GITHUB_TOKEN" >~/.netrc
        ./publish-gh-pages.sh $DOCS_VERSION
      fi
    else
      # Make sure the website builds without error
      node server/generate.js
    fi

cd "$(dirname "$0")"

cd ../../react-native-gh-pages
git checkout -- .
git clean -dfx
git fetch
git rebase
rm -Rf $1
mkdir ../../react-native-gh-pages/$1
cd ../react-native/website
node server/generate.js
cp -R build/react-native/* ../../react-native-gh-pages/$1
cp ../circle.yml ../../react-native-gh-pages/
rm -Rf build/
cd ../../react-native-gh-pages
git status
git add -A .
if ! git diff-index --quiet HEAD --; then
  git commit -m "update website"
  git push origin gh-pages
fi
cd ../react-native/website

*/

var branch = process.env.TRAVIS_BRANCH;
var isPullRequest = process.env.TRAVIS_PULL_REQUEST;
var isTravis = process.env.TRAVIS;

console.log("RUNNING NODE", branch, isPullRequest, isTravis);

var gitPromise = require('git-promise');
var gitUtil = require('git-promise/util');
//var del = require('del');
var fs = require('fs');
var os = require('os');
//var generate = require('./server/generate.js');

