# Use Maven with OpenJDK 17 as base image
FROM maven:3.9.4-openjdk-17-slim

# Set working directory
WORKDIR /app

# Install Chrome and dependencies for Selenium
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    xvfb \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libnss3 \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Copy Maven configuration first for better caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src
COPY *.xml ./
COPY config.sample.properties ./

# Create config.properties from sample
RUN cp config.sample.properties config.properties

# Set environment variables for headless operation
ENV DISPLAY=:99
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROME_OPTS="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu --window-size=1920,1080"

# Create entrypoint script
RUN echo '#!/bin/bash\n\
# Start Xvfb\n\
Xvfb :99 -screen 0 1920x1080x24 &\n\
\n\
# Update config.properties with environment variables\n\
if [ ! -z "$QA_CRM_URL" ]; then\n\
    sed -i "s|qa_crm_url=.*|qa_crm_url=$QA_CRM_URL|" config.properties\n\
fi\n\
if [ ! -z "$UAT_CRM_URL" ]; then\n\
    sed -i "s|uat_crm_url=.*|uat_crm_url=$UAT_CRM_URL|" config.properties\n\
fi\n\
if [ ! -z "$CRM_USERNAME" ]; then\n\
    sed -i "s|crm_username=.*|crm_username=$CRM_USERNAME|" config.properties\n\
fi\n\
if [ ! -z "$CRM_PASSWORD" ]; then\n\
    sed -i "s|crm_password=.*|crm_password=$CRM_PASSWORD|" config.properties\n\
fi\n\
if [ ! -z "$BROWSER" ]; then\n\
    sed -i "s|browser=.*|browser=$BROWSER|" config.properties\n\
fi\n\
\n\
# Run the tests\n\
exec "$@"' > /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Default command
CMD ["mvn", "clean", "test"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:4444/wd/hub/status || exit 1

# Labels for metadata
LABEL maintainer="CCOF QA Team"
LABEL description="CCOF Selenium Test Automation Docker Image"
LABEL version="1.0"