#!/bin/bash

# Source directory path
src_dir_atoms="utility/components/atoms"
src_dir_molecules="utility/components/molecules"

# Destination directory path
dest_dir_atoms="components/atoms"
dest_dir_molecules="components/molecules"

#Refreshing state
rm -r "$dest_dir_atoms"
rm -r "$dest_dir_molecules"

mkdir "$dest_dir_atoms"
mkdir "$dest_dir_molecules"

# Function to copy files
copy_files() {
  local source_path="$1"
  local dest_path="$2"
  component_folders=($(ls "$source_path"))
  for folder in "${component_folders[@]}"; do
  list_components=($(ls "$source_path/$folder"))
  mkdir "$dest_path/$folder"
    for components in "${list_components[@]}"; do
      mkdir "$dest_path/$folder/$components"
      cp -r "$source_path/$folder/$components/index.js" "$dest_path/$folder/$components/index.js"
      cp -r "$source_path/$folder/$components/index.vue" "$dest_path/$folder/$components/index.vue"
    done
  done
}

copy_files "$src_dir_atoms" "$dest_dir_atoms"
copy_files "$src_dir_molecules" "$dest_dir_molecules"
