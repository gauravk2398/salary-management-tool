FROM ruby:3.2.2-slim

# Install system dependencies
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  git \
  pkg-config \
  curl \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Bundler
RUN gem install bundler:2.4.10

# Copy gem files and install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Expose port 3000
EXPOSE 3000

# Start rails server by default
CMD ["rails", "server", "-b", "0.0.0.0"]
