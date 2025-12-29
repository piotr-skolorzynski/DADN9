# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0.100 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["API.csproj", "./"]
RUN dotnet restore "API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0.0 AS final
WORKDIR /app

# Create non-root user with home directory
RUN groupadd -r appuser -g 1000 && \
    useradd -r -g appuser -u 1000 -m -d /home/appuser -s /bin/bash appuser

# Copy published app
COPY --from=publish /app/publish .

# Create data directory for SQLite and set permissions
RUN mkdir -p /app/data && \
    chown -R appuser:appuser /app /home/appuser

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Install curl for health checks
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "API.dll"]

