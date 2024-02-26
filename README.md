# C-Space 

C-Space is a platform designed to address the unique challenges faced by YouTubers who are constantly on the move, exploring remote locations with limited internet access. The platform provides a secure and efficient solution for YouTubers and their editors to collaborate on video content without compromising account security.

## Problem Statement

Many YouTubers face difficulties in downloading large edited video files, especially when they are in locations with limited internet access or expensive data packs. While adding editors to their YouTube Studio account seems like a solution, it raises security concerns as it grants complete access to editors, potentially compromising the YouTuber's account.

## Solution

C-Space offers a secure alternative where YouTubers and editors can collaborate without compromising account security. The platform allows editors to upload videos, which remain on C-Space servers until approved by the owners. Once approved, the videos are directly published to the YouTuber's YouTube account without the need to download large files.

## Terminology

- **Rooms**: Analogous to YouTube channels, users can be part of multiple rooms, serving as either an editor or an owner.
  
- **Owners**: Owners have the authority to add, edit, and publish videos to YouTube. In multi-owner rooms, consensus is required for certain actions, ensuring secure and collective decision-making.

- **Editors**: Editors can upload and edit videos, facilitating collaboration within rooms.

- **Consensus Mechanism**: In rooms with multiple owners, consensus is required for actions like publishing videos or removing a member, ensuring secure and collective decision-making.

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Input Validation**: Zod
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: OAuth and NextAuth
- **State Management**: Recoil
- **UI Libraries**: NextUI, Shadcn UI, Radix UI, MUI, Flowbite and Tailwind CSS
- **AWS**: S3, RDS, EC2

## Getting Started

To experience the platform, visit [C-Space](#) and sign up as either an owner or an editor. Explore the rooms, upload and edit videos, and witness the seamless collaboration between YouTubers and editors.

## Installation

1. Clone the repository: `git clone https://github.com/DarkWolff71/C-Space.git`
2. Create .env and .env.local files:
    - `cd C-Space`
    - `vim .env.local` // populate it referring .env.local.sample
    - `vim prisma/.env` // populate it referring prisma/.env.sample
3. Install dependencies: `pnpm install`
3. Set up the database and configure environmental variables.
4. Run the application: `pnpm run dev`
  

## Contributing

We welcome contributions from the community. If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
