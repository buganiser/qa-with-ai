# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal Java project containing a single "Hello World" program in `myTest.java`.

## Building and Running

```bash
# Compile
javac myTest.java

# Run
java myTest
```

## Project Structure

```
.
├── myTest.java    # Main Java source file
└── myTest.class   # Compiled bytecode (generated)
```

## Notes

- No build system (Maven/Gradle) - uses plain `javac`/`java`
- Single class with `main` method
- Output: "hello world"