# CMC BioMed Career Connections

## JSON Structure Documentation

This document explains the JSON structure used in the Professional Profiles system. Each entry in the JSON array represents a healthcare professional's profile with detailed attributes. This guide will help non-technical users understand how data is structured and how it impacts the application.

### JSON Field Definitions

Below is a detailed description of each field in the JSON structure for the Professional Profiles:

| Field              | Description                                                                                                                       | Type             | Accepted Format | Example                                           |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------|------------------|-----------------|---------------------------------------------------|
| `name`             | Full name of the professional. This is displayed on their profile page.                                                          | string           | N/A             | `"David Oh"`                                      |
| `designation`      | Full official job title at the organization.                                                                                      | string           | N/A             | `"Chief medical officer at Hoxworth Blood Center"`|
| `designationShort` | Abbreviated job title used in smaller spaces or where the full title is not necessary.                                            | string           | N/A             | `"Chief medical officer"`                         |
| `profileImage`     | Path to the profile image file. This image is used to visually represent the professional on their profile.                       | string           | Relative path   | `"david-oh/profile.png"`                          |
| `coverImage`       | Path to the cover image file. This image is displayed as a background or banner on their profile page.                            | string           | Relative path   | `"david-oh/cover.png"`                            |
| `story`            | A brief narrative or description of the professional's role, responsibilities, and personal insights related to their profession. | string           | N/A             | `"Blood is considered to be a drug and we're..."` |
| `careerPathImage`  | Path to an image depicting the professional's career path or milestones. This visualizes their professional journey.               | string           | Relative path   | `"david-oh/career-path.png"`                      |

### Usage

Each field should be carefully filled to ensure the profile is accurate and informative. The images should be placed in the corresponding paths, and the text should be reviewed for correctness and impact.

