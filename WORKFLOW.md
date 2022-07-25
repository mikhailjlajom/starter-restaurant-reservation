# create a new branch off main
git branch -b US-01

# finish and pass all tests in local development env

git add .
git commit -m "your message"
git push origin US-01

# go to github.com and do a pull request (PR)
# merge the branch (US-01) into main

# switch over to main branch
git checkout main

# pull latest merge changes
git pull origin main

# delete branch on github

# delete the branch locally
git branch -D US-01

# redeploy to heroku
git add .
git commit -m "pushing to heroku"
git subtree push ... for both backend and frontend

# make a new branch and repeat
git checkout -b US-02