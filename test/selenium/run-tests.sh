#!/bin/bash

# CCOF Selenium Test Runner Script
# Usage: ./run-tests.sh [test-suite] [browser] [environment]

set -e

# Default values
DEFAULT_SUITE="TestLoginSuite.xml"
DEFAULT_BROWSER="chrome"
DEFAULT_ENV="qa"

# Parse command line arguments
TEST_SUITE=${1:-$DEFAULT_SUITE}
BROWSER=${2:-$DEFAULT_BROWSER}
ENVIRONMENT=${3:-$DEFAULT_ENV}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed or not in PATH"
        exit 1
    fi
    
    # Check Maven
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed or not in PATH"
        exit 1
    fi
    
    # Check config file
    if [ ! -f "config.properties" ]; then
        if [ -f "config.sample.properties" ]; then
            print_warning "config.properties not found. Copying from sample..."
            cp config.sample.properties config.properties
            print_warning "Please update config.properties with your credentials"
        else
            print_error "Neither config.properties nor config.sample.properties found"
            exit 1
        fi
    fi
    
    print_success "Prerequisites check completed"
}

# Function to validate test suite
validate_test_suite() {
    if [ ! -f "$TEST_SUITE" ]; then
        print_error "Test suite file '$TEST_SUITE' not found"
        print_info "Available test suites:"
        ls -1 *.xml 2>/dev/null || print_warning "No XML test suites found"
        exit 1
    fi
}

# Function to setup environment
setup_environment() {
    print_info "Setting up test environment..."
    
    # Create directories if they don't exist
    mkdir -p target/surefire-reports
    mkdir -p extent-reports
    mkdir -p logs
    mkdir -p screenshots
    
    # Update config.properties based on environment
    case $ENVIRONMENT in
        "qa")
            print_info "Configuring for QA environment"
            ;;
        "uat")
            print_info "Configuring for UAT environment"
            ;;
        *)
            print_warning "Unknown environment: $ENVIRONMENT. Using default QA configuration"
            ;;
    esac
    
    # Update browser in config
    if grep -q "browser=" config.properties; then
        sed -i.bak "s/browser=.*/browser=$BROWSER/" config.properties
        print_info "Updated browser configuration to: $BROWSER"
    fi
}

# Function to run tests
run_tests() {
    print_info "Starting test execution..."
    print_info "Test Suite: $TEST_SUITE"
    print_info "Browser: $BROWSER"
    print_info "Environment: $ENVIRONMENT"
    
    # Run Maven tests
    if mvn clean test -Dsuite="$TEST_SUITE" -Dbrowser="$BROWSER"; then
        print_success "Tests completed successfully!"
    else
        print_error "Tests failed!"
        return 1
    fi
}

# Function to generate reports
generate_reports() {
    print_info "Generating test reports..."
    
    # Check if reports were generated
    if [ -d "target/surefire-reports" ] && [ "$(ls -A target/surefire-reports)" ]; then
        print_success "TestNG reports generated in target/surefire-reports/"
    fi
    
    if [ -d "extent-reports" ] && [ "$(ls -A extent-reports)" ]; then
        print_success "Extent reports generated in extent-reports/"
        if [ -f "extent-reports/extent-report.html" ]; then
            print_info "Open extent-reports/extent-report.html in your browser to view detailed results"
        fi
    fi
    
    if [ -d "logs" ] && [ "$(ls -A logs)" ]; then
        print_success "Test logs available in logs/"
    fi
}

# Function to cleanup
cleanup() {
    print_info "Cleaning up temporary files..."
    # Remove backup files created by sed
    rm -f config.properties.bak
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [test-suite] [browser] [environment]"
    echo ""
    echo "Parameters:"
    echo "  test-suite   TestNG XML file (default: $DEFAULT_SUITE)"
    echo "  browser      Browser to use: chrome, firefox, edge (default: $DEFAULT_BROWSER)"
    echo "  environment  Environment: qa, uat (default: $DEFAULT_ENV)"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run default configuration"
    echo "  $0 TestNG.xml                        # Run all tests with default browser"
    echo "  $0 TestLoginSuite.xml firefox qa     # Run login tests with Firefox on QA"
    echo "  $0 TestNG.xml chrome uat             # Run all tests with Chrome on UAT"
}

# Function to handle Docker execution
run_with_docker() {
    print_info "Running tests with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Build Docker image
    print_info "Building Docker image..."
    docker build -t ccof-selenium-tests .
    
    # Run tests in Docker
    print_info "Running tests in Docker container..."
    docker run --rm \
        -v "$(pwd)/target:/app/target" \
        -v "$(pwd)/extent-reports:/app/extent-reports" \
        -v "$(pwd)/logs:/app/logs" \
        -e QA_CRM_URL="$QA_CRM_URL" \
        -e UAT_CRM_URL="$UAT_CRM_URL" \
        -e CRM_USERNAME="$CRM_USERNAME" \
        -e CRM_PASSWORD="$CRM_PASSWORD" \
        -e BROWSER="$BROWSER" \
        ccof-selenium-tests mvn test -Dsuite="$TEST_SUITE"
}

# Main execution
main() {
    echo "=========================================="
    echo "   CCOF Selenium Test Runner"
    echo "=========================================="
    
    # Handle special flags
    case "${1:-}" in
        "-h"|"--help")
            show_usage
            exit 0
            ;;
        "--docker")
            shift
            TEST_SUITE=${1:-$DEFAULT_SUITE}
            BROWSER=${2:-$DEFAULT_BROWSER}
            ENVIRONMENT=${3:-$DEFAULT_ENV}
            run_with_docker
            exit 0
            ;;
    esac
    
    # Setup trap for cleanup
    trap cleanup EXIT
    
    # Execute main workflow
    check_prerequisites
    validate_test_suite
    setup_environment
    
    if run_tests; then
        generate_reports
        print_success "Test execution completed successfully!"
        exit 0
    else
        generate_reports
        print_error "Test execution failed!"
        exit 1
    fi
}

# Execute main function with all arguments
main "$@"