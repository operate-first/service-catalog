NODEJS_BASE_IMAGE=$(cat .aicoe-ci.yaml | grep -oP '(?<=base-image: ).*')


# Checks whether the important programs are installed
if ! command -v podman &> /dev/null; then
  echo "This script requires podman to be installed."
  exit 1
fi
if ! command -v s2i &> /dev/null; then
  echo "This script requires s2i to be installed."
  exit 1
fi
# Creates temporary folder for the build
tmp_dir=$(mktemp -d -t service-catalog-XXXXXXXXXX)


echo "---> Run s2i build"
s2i build . ${NODEJS_BASE_IMAGE} --as-dockerfile ${tmp_dir}/Containerfile
cd $tmp_dir

# Install gzip as root before the user switches to 1001
sed -i '/USER root/a RUN microdnf install -y gzip' Containerfile

echo "---> Create image"
podman build -t service-catalog .

# Add tags to image
if ! [[ $# -eq 0 ]] ; then
  tags=$(echo "$@" | xargs printf -- 'localhost/service-catalog:%s ')
  podman tag localhost/service-catalog $tags
fi

echo "---> Clean up"
rm -rf $tmp_dir
