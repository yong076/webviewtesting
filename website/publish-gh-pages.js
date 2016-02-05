/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const branch = process.env.TRAVIS_BRANCH;
const isPullRequest = process.env.TRAVIS_PULL_REQUEST;
const isTravis = process.env.TRAVIS;
const remoteBranch = 'git://github.com/facebook/react-native.git';
require('shelljs/global');

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

let version;
if (branch.indexOf('-stable') !== -1) {
  version = branch.slice(0, branch.indexOf('-stable'));
}

if (exec(`node ./server/generate.js`).code !== 0) {
  echo('Error: Generating HTML failed');
}

if (!isPullRequest && isTravis && version) {
  echo(`Building stable branch ${version}, preparing to push to ght-pages`');
  // if code is running in a branch in CI, commit changes to gh-pages branch
  cd('build');
  rm('-rf', 'react-native-gh-pages');

  if (exec(`git clone ${remoteBranch} react-native-gh-pages`).code !== 0) {
    echo('Error: Git clone failed');
    exit(1);
  }

  cd('react-native-gh-pages');

  const checkoutCode = exec(`git checkout origin/gh-pages`).code;
  checkoutCode += exec(`git checkout -b gh-pages`).code;
  checkoutCode += exec(`git branch --set-upstream-to=origin/gh-pages`).code;

  if (checkoutCode !== 0) {
    echo('Error: Git checkout gh-pages failed');
    exit(1);
  }

  rm('-rf', `releases/${version}`);
  mkdir('-p', `releases/${version}`);
  exec(`cp -R ../react-native/* releases/${version}`);
  exec(`cp ../../../circle.yml .`);

  exec(`git status`);
  exec(`git add -A .`);
  if (exec(`git diff-index --quiet HEAD --`).code !== 0) {
    const checkInCode = exec(`git commit -m "update website"`).code;
    checkInCode += exec(`git push origin gh-pages`).code;
    if (checkInCode !== 0) {
      echo('Error: Git checkout gh-pages failed');
      exit(1);    
    }
  }
}




