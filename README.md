# Habitus - Sales Performance & Habits Platform

[![Salesforce AppExchange](https://img.shields.io/badge/Salesforce-AppExchange%20Ready-blue)](https://appexchange.salesforce.com)
[![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-green)](docs/security.md)
[![GDPR](https://img.shields.io/badge/GDPR-Compliant-green)](docs/privacy.md)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](CHANGELOG.md)

## Overview

Habitus is an enterprise-grade sales performance and atomic habits platform designed for seamless integration with Salesforce. Built with modern security standards and compliance requirements for the Salesforce AppExchange.

## 🔐 Security & Compliance

- **GDPR/LGPD/CCPA Compliant**: Full data protection compliance
- **Enterprise Security**: End-to-end encryption, audit trails, role-based access
- **Salesforce Standards**: Meets all AppExchange security requirements
- **SOC 2 Type II**: Security framework compliance
- **Rate Limiting**: API protection against abuse
- **Data Retention**: Configurable data retention policies

## 🚀 Features

### Core Functionality
- **Atomic Habits Tracking**: Science-based habit formation system
- **Sales Performance Analytics**: Real-time sales metrics and KPIs
- **AI-Powered Consulting**: Intelligent recommendations and insights
- **Team Management**: Multi-team support with role-based permissions
- **Goal Setting & Tracking**: SMART goals with progress monitoring

### Enterprise Features
- **Single Sign-On (SSO)**: Salesforce identity integration
- **Audit Trail**: Complete action logging for compliance
- **Data Export**: GDPR-compliant data portability
- **Privacy Controls**: Granular consent management
- **Real-time Sync**: Bidirectional Salesforce synchronization

## 📋 System Requirements

### Minimum Requirements
- Salesforce Professional Edition or higher
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection for real-time features

### Recommended
- Salesforce Enterprise Edition
- High-speed internet (10+ Mbps)
- Desktop or tablet device for optimal experience

## 🛠 Installation

### For Salesforce Administrators

1. **AppExchange Installation**
   ```
   1. Visit Salesforce AppExchange
   2. Search for "Habitus"
   3. Click "Get It Now"
   4. Follow installation wizard
   5. Configure permissions
   ```

2. **Initial Configuration**
   - Assign user licenses
   - Configure security settings
   - Set up data sharing rules
   - Initialize company profiles

3. **User Onboarding**
   - Create user accounts
   - Assign roles and permissions
   - Configure team structures
   - Set initial goals and habits

### For Developers

Follow these steps for local development:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## 📖 User Guide

### Getting Started
1. **First Login**: Complete the guided onboarding process
2. **Profile Setup**: Configure your sales role and company information
3. **Goal Setting**: Define your sales targets and personal development goals
4. **Habit Creation**: Set up daily atomic habits for consistent improvement
5. **Team Integration**: Connect with your sales team and manager

### Daily Workflow
1. **Morning Check-in**: Review goals and plan daily habits
2. **Progress Tracking**: Log completed habits and sales activities
3. **Performance Review**: Analyze daily metrics and insights
4. **AI Consultation**: Get personalized recommendations
5. **Evening Reflection**: Review progress and plan tomorrow

## 🔧 Configuration

### Admin Settings
- **Company Profile**: Configure organization details
- **User Management**: Manage roles and permissions
- **Integration Settings**: Configure Salesforce sync
- **Privacy Controls**: Set data retention policies
- **Audit Settings**: Configure compliance logging

### User Settings
- **Personal Profile**: Update individual information
- **Notification Preferences**: Customize alerts and reminders
- **Privacy Preferences**: Control data sharing and consent
- **Dashboard Customization**: Personalize widget layout
- **Goal Configuration**: Set personal and team objectives

## 🔒 Security

### Data Protection
- **Encryption**: AES-256 encryption at rest and in transit
- **Access Control**: Role-based permissions with principle of least privilege
- **Authentication**: Multi-factor authentication support
- **Session Management**: Secure session handling with automatic timeout

### Privacy Features
- **Consent Management**: Granular privacy controls
- **Data Minimization**: Collect only necessary data
- **Right to Erasure**: Complete data deletion capabilities
- **Data Portability**: Export personal data in standard formats

### Compliance
- **Audit Trail**: Immutable action logging
- **Data Retention**: Configurable retention periods
- **Breach Notification**: Automated incident response
- **Regular Assessments**: Continuous security monitoring

## 🛡 Troubleshooting

### Common Issues

**Login Problems**
- Verify Salesforce credentials
- Check browser compatibility
- Clear cache and cookies
- Contact system administrator

**Sync Issues**
- Verify Salesforce permissions
- Check network connectivity
- Review integration settings
- Monitor system status

**Performance Issues**
- Check browser requirements
- Verify internet speed
- Close unnecessary tabs
- Contact technical support

## 📞 Support

### Contact Information
- **Sales**: [sales@habitus.com](mailto:sales@habitus.com)
- **Support**: [support@habitus.com](mailto:support@habitus.com)
- **Security**: [security@habitus.com](mailto:security@habitus.com)
- **Privacy**: [privacy@habitus.com](mailto:privacy@habitus.com)

### Support Hours
- **Business Hours**: Monday-Friday, 8 AM - 6 PM (local time)
- **Emergency Support**: 24/7 for critical issues
- **Response Time**: Within 4 hours for standard issues

## 📄 Technologies

This project is built with:

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: shadcn-ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **AI Integration**: OpenAI GPT-4

## 📈 Deployment

### Lovable Platform
Simply open [Lovable](https://lovable.dev/projects/ee70be81-dc23-444f-8403-224aec6cca87) and click on Share → Publish.

### Custom Domain
To connect a domain, navigate to Project → Settings → Domains and click Connect Domain.

## 📄 Legal

### Privacy Policy
Our commitment to protecting your personal data in compliance with global privacy regulations.

### Terms of Service
Terms and conditions governing the use of Habitus platform.

### Security Policy
Detailed information about our security practices and incident response procedures.

---

**© 2025 Habitus. All rights reserved.**

**Project URL**: https://lovable.dev/projects/ee70be81-dc23-444f-8403-224aec6cca87