// Quick enhancement script to add mobile data attributes
// This script adds data-mobile-enhanced to all remaining skill cards and other elements

document.addEventListener('DOMContentLoaded', function() {
    // Add mobile enhancement attributes to skill cards
    const skillCards = document.querySelectorAll('.skill-card:not([data-mobile-enhanced])');
    skillCards.forEach(card => {
        card.setAttribute('data-mobile-enhanced', 'true');
    });

    // Add to blog cards
    const blogCards = document.querySelectorAll('.blog-card:not([data-mobile-enhanced])');
    blogCards.forEach(card => {
        card.setAttribute('data-mobile-enhanced', 'true');
    });

    // Add to social icons
    const socialIcons = document.querySelectorAll('.social-icon:not([data-mobile-enhanced])');
    socialIcons.forEach(icon => {
        icon.setAttribute('data-mobile-enhanced', 'true');
    });

    // Add to tech tags
    const techTags = document.querySelectorAll('.tech-tag:not([data-mobile-enhanced])');
    techTags.forEach(tag => {
        tag.setAttribute('data-mobile-enhanced', 'true');
    });

    // Add to theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && !themeToggle.hasAttribute('data-mobile-enhanced')) {
        themeToggle.setAttribute('data-mobile-enhanced', 'true');
    }

    // Add to menu button
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn && !menuBtn.hasAttribute('data-mobile-enhanced')) {
        menuBtn.setAttribute('data-mobile-enhanced', 'true');
    }

    // Add to copy email button
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn && !copyEmailBtn.hasAttribute('data-mobile-enhanced')) {
        copyEmailBtn.setAttribute('data-mobile-enhanced', 'true');
    }

    // Add to back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn && !backToTopBtn.hasAttribute('data-mobile-enhanced')) {
        backToTopBtn.setAttribute('data-mobile-enhanced', 'true');
    }

    console.log('Mobile enhancement attributes added to elements');
});
