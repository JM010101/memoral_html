import { defineConfig } from "tinacms";

// Your TinaCMS configuration
// Visit tina.io to get your clientId and token

export default defineConfig({
  // Credentials from environment variables (for Vercel) or hardcoded (for local dev)
  branch: "main", // Change to "master" if that's your default branch
  clientId: process.env.TINA_CLIENT_ID || "721c21c2-9751-4fca-a85f-a3acb547bbbf",
  token: process.env.TINA_TOKEN || "54a189ef24bd4e877e7fb91344b42d67893f246a",

  build: {
    outputFolder: "admin",
    publicFolder: "",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "",
    },
  },

  schema: {
    collections: [
      {
        name: "memorial",
        label: "Memorials",
        path: "data",
        format: "json",
        ui: {
          filename: {
            readonly: true,
            slugify: values => {
              return `memorials`;
            },
          },
        },
        fields: [
          {
            type: "object",
            name: "memorials",
            label: "All Memorials",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.name || "New Memorial" };
              },
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "Memorial ID (lowercase, use hyphens)",
                required: true,
                description: "Example: john-smith",
              },
              {
                type: "string",
                name: "name",
                label: "Full Name",
                required: true,
              },
              {
                type: "datetime",
                name: "birthDate",
                label: "Birth Date",
                required: true,
                ui: {
                  dateFormat: 'YYYY-MM-DD',
                },
              },
              {
                type: "datetime",
                name: "deathDate",
                label: "Death Date",
                required: true,
                ui: {
                  dateFormat: 'YYYY-MM-DD',
                },
              },
              {
                type: "string",
                name: "tribute",
                label: "Memorial Tribute",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "photos",
                label: "Photos",
                list: true,
                ui: {
                  itemProps: (item) => {
                    return { label: item?.alt || "Photo" };
                  },
                },
                fields: [
                  {
                    type: "image",
                    name: "url",
                    label: "Photo",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Photo Description (for accessibility)",
                    required: true,
                    description: "Describe what's in the photo",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
