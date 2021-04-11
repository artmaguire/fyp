TOKEN=$1

# make and cd into correct folder
cd ..
mkdir -p deps
cd deps

FRONTEND_URL=$(curl -s -H "Authorization: token $TOKEN" \
        "https://api.github.com/repos/artmaguire/fyp-frontend/releases/latest" \
        | grep releases/assets | cut -d '"' -f 4)

curl -L -s -H "Accept: application/octet-stream" -H "Authorization: token $TOKEN" "$FRONTEND_URL" > public.tar.gz

ASTAR_URL=$(curl -s -H "Authorization: token $TOKEN" \
        "https://api.github.com/repos/artmaguire/a-star/releases/latest" \
        | grep releases/assets | cut -d '"' -f 4)

curl -L -s -H "Accept: application/octet-stream" -H "Authorization: token $TOKEN" "$ASTAR_URL" > dfosm-1-py3-none-any.whl
