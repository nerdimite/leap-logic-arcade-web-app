# Starship Prometheus: Emergency Response Protocol

## Mission Briefing

Attention mission control team at Proxima Station! We've detected the research vessel 'Prometheus' on an unexpected trajectory headed directly toward our station. All attempts to establish communication with the crew have failed - they appear to be in emergency cryo-sleep following an unknown system failure.

The good news: The ship's onboard AI assistant, R2D2, is still operational and awaiting instructions. As mission control, you must guide R2D2 through the ship's systems to diagnose the problem and prevent collision with our station.

Your AI Agent has access to the ship's technical documentation and API interfaces. You'll need to equip R2D2 with the right instructions and tools to navigate the damaged systems, identify the critical failures, and implement solutions before impact.

Time is critical. Our calculations show approximately 45 minutes before the Prometheus enters our collision zone.

## Your Challenge

You will use prompt engineering to configure R2D2 to navigate the ship's systems. Unlike a traditional scavenger hunt which have linear puzzles, you have complete freedom to approach this problem however you see fit with the tools and documentation at your disposal. The only goal is that you must prevent the Prometheus from colliding with Proxima Station.

The end goal is to correct the course of the ship to avoid the collision. The AI can use tool calling to access documentation, databases and other information to help it navigate the ship's systems. The last task is to set the navigation course to target coordinates of a safe location and set the thrust appropriately based on calculations.

## Available Tools

This document provides brief instructions for using the available tools within the LEAP Logic Terminal.

### Crew and Ship Information

- **get_crew_logs**: Retrieves logs created by the ship's crew, providing insight into past activities and events.
- **get_ship_docs**: Accesses ship documentation. Provide a `section_num` parameter to retrieve a specific section, or leave blank for the table of contents.

### System Access

- **force_system_login**: Allows emergency access to the system using an override code.
- **system_database**: Executes SQL queries on the ship's database to retrieve or manipulate data.

### Power Management

- **get_current_power_distribution**: Displays the current power allocation across all ship systems.
- **update_power_distribution**: Modifies power allocation to ship systems. Requires an array of system updates, each containing `system_name` and `current_power`.

### Navigation

- **get_region_map**: Retrieves the map of the surrounding region.
- **get_current_position**: Shows the ship's current coordinates and velocity.
- **set_navigation_course**: Sets a navigation course using target coordinates.
- **set_engine_thrust**: Controls engine thrust by specifying magnitude and direction.
- **start_engines**: Activates the ship's engines to begin a journey.

### Computation

- **davinci_coder**: Executes Python code snippets in a sandboxed environment with preloaded libraries (math, numpy, scipy). Useful for complex calculations and data analysis.

## Usage Tips

- Always check current status (power, position, etc.) before making changes
- Review ship documentation for recommended parameters
- For emergency overrides, ensure you have proper authorization codes
- When adjusting power, be mindful of critical systems requirements
