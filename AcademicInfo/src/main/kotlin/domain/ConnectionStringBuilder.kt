package domain

import java.io.File


class ConnectionStringBuilder
{
    companion object {
        // Creates a connection string for postgresql
        // Needs a file which contains
        // 1. The host ip
        // 2. The port
        // 3. The database name
        fun createString(fileName: String) : String {
            val data = File(fileName).readLines()
            return "jdbc:postgresql://${data[0]}:${data[1]}/${data[2]}"
        }
    }
}