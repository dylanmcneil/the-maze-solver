package app;

import app.models.User;
import app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner init(UserRepository userRepository) {
        System.out.println("    ___      _____ ______   ________  ________  _______           ________  ________  ___       ___      ___ _______   ________          ___    \n" +
                "   /  /|    |\\   _ \\  _   \\|\\   __  \\|\\_____  \\|\\  ___ \\         |\\   ____\\|\\   __  \\|\\  \\     |\\  \\    /  /|\\  ___ \\ |\\   __  \\        |\\  \\   \n" +
                "  /  / /    \\ \\  \\\\\\__\\ \\  \\ \\  \\|\\  \\\\|___/  /\\ \\   __/|        \\ \\  \\___|\\ \\  \\|\\  \\ \\  \\    \\ \\  \\  /  / | \\   __/|\\ \\  \\|\\  \\       \\ \\  \\  \n" +
                " /  / /      \\ \\  \\\\|__| \\  \\ \\   __  \\   /  / /\\ \\  \\_|/__       \\ \\_____  \\ \\  \\\\\\  \\ \\  \\    \\ \\  \\/  / / \\ \\  \\_|/_\\ \\   _  _\\       \\ \\  \\ \n" +
                "|\\  \\/        \\ \\  \\    \\ \\  \\ \\  \\ \\  \\ /  /_/__\\ \\  \\_|\\ \\       \\|____|\\  \\ \\  \\\\\\  \\ \\  \\____\\ \\    / /   \\ \\  \\_|\\ \\ \\  \\\\  \\|       \\/  /|\n" +
                "\\ \\  \\         \\ \\__\\    \\ \\__\\ \\__\\ \\__\\\\________\\ \\_______\\        ____\\_\\  \\ \\_______\\ \\_______\\ \\__/ /     \\ \\_______\\ \\__\\\\ _\\       /  // \n" +
                " \\ \\__\\         \\|__|     \\|__|\\|__|\\|__|\\|_______|\\|_______|       |\\_________\\|_______|\\|_______|\\|__|/       \\|_______|\\|__|\\|__|     /_ //  \n" +
                "  \\|__|                                                             \\|_________|                                                        |__|/   ");

        return args -> {
            Stream.of("John", "Julie", "Jennifer", "Helen", "Rachel").forEach(name -> {
                User user = new User(name, name.toLowerCase() + "@domain.com");
                userRepository.save(user);
            });
            userRepository.findAll().forEach(System.out::println);
        };
    }
}
