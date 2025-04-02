<div align="center">
  <h1>🔐 GDrive 3.0</h1>
  <p><strong>Next-Generation Decentralized File Storage Solution</strong></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#smart-contract">Smart Contract</a> •
    <a href="#api-endpoints">API</a>
  </p>
  
  ![GitHub license](https://img.shields.io/github/license/Prajapatishivam65/Google-Drive-3.0)
  ![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
  ![IPFS](https://img.shields.io/badge/Storage-IPFS-green)

  <!-- Add your project logo or screenshot here -->
  <!-- <img src="path/to/logo.png" alt="GDrive 3.0 Logo" width="400"> -->
</div>

## 📋 Overview

GDrive 3.0 is a cutting-edge decentralized file storage platform that combines blockchain technology with IPFS (InterPlanetary File System) to create a secure, permanent, and censorship-resistant storage solution. Unlike traditional cloud services, GDrive 3.0 ensures your data remains truly yours while maintaining accessibility from anywhere in the world.

## ✨ Features

- **🌐 Decentralized Storage**: Files are distributed across the IPFS network via Pinata, eliminating single points of failure
- **🔒 End-to-End Security**: Cryptographic hashing ensures file integrity and tamper protection
- **⛓️ Blockchain Verification**: Smart contracts manage file metadata and access permissions on-chain
- **🖥️ Intuitive Interface**: Modern, responsive UI for seamless file management experience
- **⚡ High Performance**: Optimized for speed and reliability, even with large files
- **📱 Cross-Platform**: Access your files from any device with internet connectivity

## 🛠️ Tech Stack

| Category           | Technologies                                                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**       | ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)                                            |
| **Backend**        | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express)                                      |
| **Blockchain**     | ![Ethereum](https://img.shields.io/badge/-Ethereum-3C3C3D?style=flat-square&logo=ethereum) ![Polygon](https://img.shields.io/badge/-Polygon-8247E5?style=flat-square&logo=polygon)                                                   |
| **Storage**        | ![IPFS](https://img.shields.io/badge/-IPFS-65C2CB?style=flat-square&logo=ipfs&logoColor=white) ![Pinata](https://img.shields.io/badge/-Pinata-E4405F?style=flat-square)                                                              |
| **Authentication** | ![Metamask](https://img.shields.io/badge/-Metamask-F6851B?style=flat-square&logo=metamask&logoColor=white) ![WalletConnect](https://img.shields.io/badge/-WalletConnect-3B99FC?style=flat-square&logo=walletconnect&logoColor=white) |
| **Database**       | ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)                   |

## ⚙️ Installation

### Prerequisites

- Node.js (v18+)
- Metamask extension installed
- Pinata account with API credentials
- Infura/Alchemy account (for blockchain integration)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Prajapatishivam65/Google-Drive-3.0.git
cd Google-Drive-3.0

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your credentials:
# PINATA_API_KEY=your_pinata_api_key
# PINATA_SECRET_KEY=your_pinata_secret_key
# NEXT_PUBLIC_INFURA_ID=your_infura_project_id
# NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id

# Start the development server
npm run dev
```

## 🚀 Usage

### File Management

1. **Connect Wallet**: Use Metamask or WalletConnect to authenticate
2. **Upload Files**: Drag and drop or select files to upload to IPFS
3. **Manage Library**: View, organize, and share your decentralized file collection
4. **Access Control**: Set permissions to control who can view or download your files

### Advanced Features

- **File Encryption**: Enable optional encryption for sensitive documents
- **Version History**: Track changes and restore previous versions of your files
- **Sharing & Collaboration**: Generate secure links to share with others

## 📝 Smart Contract

GDrive 3.0 uses Ethereum smart contracts to manage file ownership and access control:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash;
        string name;
        address owner;
        uint256 timestamp;
        bool isPublic;
    }

    mapping(address => File[]) public userFiles;
    mapping(string => address[]) public fileAccess;

    event FileUploaded(address owner, string ipfsHash, string name, uint256 timestamp);
    event AccessGranted(address owner, address user, string ipfsHash);

    function uploadFile(string memory _ipfsHash, string memory _name, bool _isPublic) public {
        userFiles[msg.sender].push(File(_ipfsHash, _name, msg.sender, block.timestamp, _isPublic));
        emit FileUploaded(msg.sender, _ipfsHash, _name, block.timestamp);
    }

    function grantAccess(string memory _ipfsHash, address _user) public {
        fileAccess[_ipfsHash].push(_user);
        emit AccessGranted(msg.sender, _user, _ipfsHash);
    }
}
```

## 🔌 API Endpoints

| Method   | Endpoint              | Description                        |
| -------- | --------------------- | ---------------------------------- |
| `POST`   | `/api/upload`         | Upload file to IPFS via Pinata     |
| `GET`    | `/api/files/:address` | Retrieve a user's files            |
| `GET`    | `/api/file/:cid`      | Get file details by IPFS CID       |
| `POST`   | `/api/share`          | Share file with another user       |
| `DELETE` | `/api/file/:cid`      | Remove file from user's collection |

## 🤝 Contributing

We welcome contributions to GDrive 3.0! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by Shivam Prajapati </sub>
</div>
