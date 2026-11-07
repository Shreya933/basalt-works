/**
 * Site-wide settings.
 * Put a real address in `contactEmail` and every "Start a project" / "Work with us"
 * button becomes a mailto: link. While it is empty those buttons just scroll to the end.
 */
export const site = {
  name: 'Basalt Works',
  contactEmail: '',
};

export const modelUrl = (name) => `${import.meta.env.BASE_URL}models/${name}.glb`;
