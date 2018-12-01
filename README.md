# outsurfing

First time with outsurfing
==========================

First install ionic v4 (including node):
https://beta.ionicframework.com/docs/installation/cli

install angular-cli:
npm install -g @angular/cli@6.2.5

clone the project:
git clone https://github.com/keremg/outsurfing.git

update all dependencies packages:
npm i

npm rebuild 

Using outsurfing
================
open Window's command prompt
ionic serve

(it will serve the app on port 8100, and will constantly compile the project)

check by browsing to http://localhost:8100/




Updating Git:
==============
after you've made changes, do the following:
0. Assuming you are on master branch (locally on our pc) and made changes to files (and maybe added few new files)

1. for any new file that you've added (not updated one, but totally new):
git add <filename>

2. do this to put all changes on the 'side':
git stash

3. get all updates that other people added
git pull

4. creating a branch: (notice to change the name of the branch to <yourname>/<branch-name> with any 1-3 words description)
git co -b tidhar/new-branch-name

5. bringing back the changes you've made, on top of the updated project:
git stash pop

6. commit your changes:
git commit -a -m "a sentence about the change you've made"

7. push your change to github
git push -f

8. go to github site https://github.com/keremg/outsurfing 
   and on the top click the green button of "compare and pull request" with your branch
   then click the green "create pull request"
   
   then you'll have a green button of "create a merged commit" or "squash and merge" or "rebase and merge"
   - change it to be the option of "rebase and merge"  and click on it to add your changes to the master
   - click "confirm rebase and merge"
   - click "delete branch" (just to clean up, not a must)
   
9. back in your CMD terminal, take the master branch:
git checkout master

10. update your local master with all changes:
git pull
